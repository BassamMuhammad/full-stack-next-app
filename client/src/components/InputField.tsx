import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  ComponentWithAs,
} from "@chakra-ui/react";
import { FieldHookConfig, useField } from "formik";

type InputFieldProps = FieldHookConfig<string | number> & {
  label: string;
  textArea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = (props) => {
  const [field, { error }] = useField(props);
  let InputOrTextArea: ComponentWithAs<"input" | "textarea"> = Input;
  if (props.textArea) InputOrTextArea = Textarea;
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <InputOrTextArea
        {...field}
        type={props.type}
        id={field.name}
        placeholder={props.placeholder}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
