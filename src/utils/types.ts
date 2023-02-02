export type DatasetHelper = {
  set: <Dataset extends DOMStringMap>($element: HTMLElement, dataset: Dataset) => void;
  get: <Dataset extends DOMStringMap>(
    $element: HTMLElement,
    key: keyof Dataset extends string ? keyof Dataset : string
  ) => string | undefined;
};
