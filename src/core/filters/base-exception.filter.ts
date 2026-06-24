import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { BaseException } from '@sisques-labs/nestjs-kit';
import { Response } from 'express';

/**
 * Maps domain exceptions (BaseException from @sisques-labs/nestjs-kit) to HTTP
 * responses. Each bounded context exposes a `resolve<Context>ExceptionStatus`
 * helper in its `transport/exceptions/` folder; wire them into `resolveStatus`
 * as contexts are added.
 */
@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost): void {
    const status = this.resolveStatus(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    });
  }

  private resolveStatus(_exception: BaseException): number {
    // Plug per-context resolvers here, e.g.:
    //   resolvePlantSpeciesExceptionStatus(_exception) ??
    return HttpStatus.BAD_REQUEST;
  }
}
