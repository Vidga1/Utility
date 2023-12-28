const orderStates = [
  "initial",
  "inWork",
  "buyingSupplies",
  "producing",
  "fullfilled",
] as const;

type OrderState = (typeof orderStates)[number];

type ExcludedStates = "buyingSupplies" | "producing";
type AvailableStates = Exclude<OrderState, ExcludedStates>;

export const getUserOrderStates = (states: OrderState[]): AvailableStates[] => {
  const filteredStates: AvailableStates[] = [];
  states.forEach((element) => {
    if (element !== "buyingSupplies" && element !== "producing") {
      filteredStates.push(element as AvailableStates);
    }
  });
  return filteredStates;
};
