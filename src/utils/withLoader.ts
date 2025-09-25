import { loading } from '@common/LoaderService';

export async function withLoader<T>(fn: () => Promise<T>): Promise<T> {
  loading.push();
  try {
    return await fn();
  } finally {
    loading.pop();
  }
}
