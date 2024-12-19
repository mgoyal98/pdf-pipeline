import { createNamespace, getNamespace } from 'cls-hooked';

const namespace = createNamespace('logger');

interface LogContext {
  loopId?: string;
  messageId?: string;
  queueName?: string;
}

export const withContext = async <T>(
  context: Partial<LogContext>,
  fn: () => Promise<T>
): Promise<T> => {
  return new Promise((resolve, reject) => {
    namespace.run(() => {
      // Set the context values
      Object.entries(context).forEach(([key, value]) => {
        namespace.set(key, value);
      });

      // Run the function
      fn().then(resolve).catch(reject);
    });
  });
};

export const getLogContext = (): LogContext => {
  const ns = getNamespace('logger');
  if (!ns) return {};

  return {
    loopId: ns.get('loopId'),
    messageId: ns.get('messageId'),
    queueName: ns.get('queueName'),
  };
};
