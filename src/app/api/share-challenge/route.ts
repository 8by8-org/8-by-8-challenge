import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
// import { requestBodySchema } from './request-body-schema';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { ServerError } from '@/errors/server-error';

export async function PUT(request: NextRequest) {
  // 
  console.log('function works')
  
  
}
