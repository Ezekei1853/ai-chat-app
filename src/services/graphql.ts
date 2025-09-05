// services/graphql.ts
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
      console.log(result,'__result')
      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message);
      }

      if (!result.data) {
        throw new Error('No data returned from GraphQL query');
      }
      alert(result.data)
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

    const response = await this.request<{ sendMessage: ChatResponse }>({
      query,
      variables,
    });
    console.log(response,'______responseeeeee')
    return response.sendMessage;
  }

  // 获取聊天历史
  async getChatHistory(userId?: string): Promise<HistoryResponse> {
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

    const response = await this.request<{ getChatHistory: HistoryResponse }>({
      query,
      variables,
    });

    return response.getChatHistory;
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

    const response = await this.request<{ deleteHistory: DeleteResponse }>({
      query,
      variables,
    });

    return response.deleteHistory;
  }

  // 健康检查
  async healthCheck(): Promise<string> {
    const query = `
      query Health {
        health
      }
    `;

    const response = await this.request<{ health: string }>({
      query,
    });

    return response.health;
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