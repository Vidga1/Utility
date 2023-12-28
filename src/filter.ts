type Order =
  | {
      state: "initial";
      sum: number;
    }
  | {
      state: "inWork";
      sum: number;
      workerId: number;
    }
  | {
      state: "buyingSupplies";
      sum: number;
      workerId: number;
      suppliesSum: number;
    }
  | {
      state: "producing";
      sum: number;
      workerId: number;
      suppliesSum: number;
      produceEstimate: Date;
    }
  | {
      state: "fullfilled";
      sum: number;
      workerId: number;
      suppliesSum: number;
      produceEstimate: Date;
      fullfillmentDate: Date;
    };

type InitialOrInWorkOrder = Extract<Order, { state: "initial" | "inWork" }>;

export const filterOnlyInitialAndInWorkOrder = (
  orders: Order[],
): InitialOrInWorkOrder[] =>
  orders.filter(
    (order): order is InitialOrInWorkOrder =>
      order.state === "initial" || order.state === "inWork",
  );
