import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { BaseException } from '@sisques-labs/nestjs-kit';
import { Response } from 'express';

import { resolvePlantSpeciesExceptionStatus } from '@contexts/plant-species/transport/exceptions/plant-species-exception.filter';

/**
 * Maps domain exceptions (BaseException from @sisques-labs/nestjs-kit) to HTTP /
 * GraphQL responses. Each bounded context exposes a
 * `resolve<Context>ExceptionStatus` helper in its `transport/exceptions/`
 * folder; wire them into `resolveStatus` as contexts are added.
 */
@Catch(BaseException)
export class BaseExceptionFilter
  implements ExceptionFilter, GqlExceptionFilter
{
  catch(exception: BaseException, host: ArgumentsHost): void {
    const status = this.resolveStatus(exception);

    const type = host.getType<'http' | 'graphql'>();

    if (type === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      response.status(status).json({
        statusCode: status,
        message: exception.message,
        error: exception.name,
      });
    } else {
      throw Object.assign(exception, { statusCode: status });
    }
  }

  private resolveStatus(exception: BaseException): number {
    return (
      resolvePlantSpeciesExceptionStatus(exception) ?? HttpStatus.BAD_REQUEST
    );
  }
}
