import { Method } from '../models/method';
/* eslint-disable @typescript-eslint/no-explicit-any */
export const mapMethodInformation = (method: any): Method => {
    return {
      id: method.$id ?? "",
      name: method.name ?? null,
      description: method.description ?? null,
      work_duration: method.work_duration ?? null,
      break_duration: method.break_duration ?? null,
      long_break_duration: method.long_break_duration ?? null,
      cycles_before_long_break: method.cycles_before_long_break ?? null,
    };
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */