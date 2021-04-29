import { Error } from "../generated/graphql";

export const toErrorMap = (errors: Error[]) => {
  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, error }) => {
    errorMap[field] = error;
  });
  return errorMap;
};
