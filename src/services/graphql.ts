// services/graphql.ts
import { Console } from 'console';
import { API_BASE_URL } from '../../config/api';

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

interface GraphQLRequestOptions {
  query: string;
  variables?: Record<string, any>;
  headers?: Record<string, string>;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  model?: string;
}

interface ChatResponse {
  message: Message;
  success: boolean;
  error?: string;
}

interface HistoryResponse {
  messages: Message[];
  success: boolean;
  error?: string;
}

interface DeleteResponse {
  success: boolean;
  message: string;
  deletedCount?: string;
}

class GraphQLClient {
  private endpoint: string;

  constructor() {
    this.endpoint = `${API_BASE_URL}/graphql`;
  }

  async request<T = any>(options: GraphQLRequestOptions): Promise<T> {
    const { query, variables = {}, headers = {} } = options;

    const requestBody = {
      query,
      variables,
    };

    try {
      console.log('GraphQL 请求:', { endpoint: this.endpoint, query, variables });
      
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GraphQLResponse<T> = await response.json();
      console.log('GraphQL 响应:', result);
      
      if (result.errors && result.errors.length > 0) {
        console.error('GraphQL 错误:', result.errors);
        throw new Error(result.errors[0].message);
      }

      if (!result.data) {
        console.error('GraphQL 响应中没有 data 字段');
        throw new Error('No data returned from GraphQL query');
      }
   
      return result.data;
    } catch (error) {
      console.error('GraphQL request failed:', error);
      throw error;
    }
  }

  // 发送聊天消息
  async sendMessage(message: string, userId?: string): Promise<ChatResponse> {
    const query = `
      mutation SendMessage($input: ChatInput!) {
        sendMessage(input: $input) {
          message {
            id
            content
            sender
            timestamp
            model
          }
          success
          error
        }
      }
    `;

    const variables = {
      input: {
        message,
        userId: userId || 'anonymous',
      },
    };

    try {
      const response = await this.request<{ sendMessage: ChatResponse }>({
        query,
        variables,
      });
      
      console.log('sendMessage 响应:', response);
      return response.sendMessage;
    } catch (error) {
      console.error('sendMessage 失败:', error);
      throw error;
    }
  }

  // 获取聊天历史
  async getChatHistory(userId?: string): Promise<HistoryResponse> {
    console.log(100000)
    const query = `
      query GetChatHistory($userId: String) {
        getChatHistory(userId: $userId) {
          messages {
            id
            content
            sender
            timestamp
            model
          }
          success
          error
        }
      }
    `;

    const variables = {
      userId: userId || 'anonymous',
    };

    try {
      console.log('正在获取聊天历史，userId:', userId);
      
      const response = await this.request<{ getChatHistory: HistoryResponse }>({
        query,
        variables,
      });

      console.log('getChatHistory 原始响应:', response);
      
      // 检查响应结构
      if (!response || !response.getChatHistory) {
        console.error('响应结构异常:', response);
        return {
          messages: [],
          success: false,
          error: '响应结构异常'
        };
      }

      const historyData = response.getChatHistory;
      console.log('getChatHistory 解析后的数据:', historyData);
      
      return historyData;
    } catch (error) {
      console.error('getChatHistory 失败:', error);
      // 返回一个默认的失败响应，而不是抛出错误
      return {
        messages: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // 删除聊天历史
  async deleteHistory(userId?: string, messageId?: string): Promise<DeleteResponse> {
    const query = `
      mutation DeleteHistory($input: DeleteHistoryInput!) {
        deleteHistory(input: $input) {
          success
          message
          deletedCount
        }
      }
    `;

    const variables = {
      input: {
        userId: userId || 'anonymous',
        messageId,
      },
    };

    try {
      const response = await this.request<{ deleteHistory: DeleteResponse }>({
        query,
        variables,
      });

      return response.deleteHistory;
    } catch (error) {
      console.error('deleteHistory 失败:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // 健康检查
  async healthCheck(): Promise<string> {
    const query = `
      query Health {
        health
      }
    `;

    try {
      const response = await this.request<{ health: string }>({
        query,
      });

      return response.health;
    } catch (error) {
      console.error('健康检查失败:', error);
      throw error;
    }
  }
}

// 导出单例实例
export const graphqlClient = new GraphQLClient();

// 导出类型
export type {
  Message,
  ChatResponse,
  HistoryResponse,
  DeleteResponse,
  GraphQLResponse,
  GraphQLRequestOptions,
};

// 预定义的 GraphQL 查询和变更
export const GRAPHQL_QUERIES = {
  GET_CHAT_HISTORY: `
    query GetChatHistory($userId: String) {
      getChatHistory(userId: $userId) {
        messages {
          id
          content
          sender
          timestamp
          model
        }
        success
        error
      }
    }
  `,

  SEND_MESSAGE: `
    mutation SendMessage($input: ChatInput!) {
      sendMessage(input: $input) {
        message {
          id
          content
          sender
          timestamp
          model
        }
        success
        error
      }
    }
  `,

  DELETE_HISTORY: `
    mutation DeleteHistory($input: DeleteHistoryInput!) {
      deleteHistory(input: $input) {
        success
        message
        deletedCount
      }
    }
  `,

  HEALTH_CHECK: `
    query Health {
      health
    }
  `,
};

export default GraphQLClient;