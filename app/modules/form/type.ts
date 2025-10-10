export type ConformControl = {
  value: string | string[] | undefined;
  change: React.Dispatch<React.SetStateAction<string | string[] | undefined>>;
  focus: () => void;
  blur: () => void;
};
