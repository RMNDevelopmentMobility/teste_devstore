import { GraphQLClient } from 'graphql-request';
import { API_CONFIG } from '@shared/constants';
import { logger } from '@core/logger';

export class GraphQLClientSingleton {
  private static instance: GraphQLClient | null = null;

  private constructor() {}

  public static getInstance(): GraphQLClient {
    if (!GraphQLClientSingleton.instance) {
      GraphQLClientSingleton.instance = new GraphQLClient(API_CONFIG.GRAPHQL_ENDPOINT, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: API_CONFIG.TIMEOUT,
      });

      logger.info('GraphQL client initialized', {
        endpoint: API_CONFIG.GRAPHQL_ENDPOINT,
      });
    }

    return GraphQLClientSingleton.instance;
  }

  public static resetInstance(): void {
    GraphQLClientSingleton.instance = null;
    logger.info('GraphQL client reset');
  }
}

export const graphqlClient = GraphQLClientSingleton.getInstance();
