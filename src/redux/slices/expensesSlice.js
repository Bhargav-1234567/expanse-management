import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addActivity } from "./activitiesSlice";

const initialState = {
  expenses: [], // { id, userId, amount, description, contributors: [{ friendId, amount }] }
  owesOwedData: {},
};
export const settleAndRecalculate = createAsyncThunk(
  "expenses/settleAndRecalculate",
  async ({ updatedExpanse, userId }, { dispatch }) => {
    dispatch(updateExpanse(updatedExpanse));

    dispatch(calculateOwesAndOwed({ userId }));
  }
);
export const addRecalculateAndLogged = createAsyncThunk(
  "expenses/addRecalculateAndLogged",
  async (data, { dispatch }) => {
    dispatch(addExpense(data.expense));
    dispatch(calculateOwesAndOwed({ userId: data.userId }));
  }
);
const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
    },
    calculateOwesAndOwed: (state, action) => {
      const { userId } = action.payload;
      const finalAmounts = {};

      state.expenses.forEach((expense) => {
        if (expense.userId === userId) {
          expense.contributors.forEach((contributor) => {
            if (contributor.isSettled) return;
            if (!finalAmounts[contributor.contributorId]) {
              finalAmounts[contributor.contributorId] = 0;
            }
            finalAmounts[contributor.contributorId] += contributor.amount;
          });
        } else {
          const contribution = expense.contributors.find(
            (contributor) =>
              contributor.contributorId === userId && !contributor.isSettled
          );
          if (contribution) {
            if (!finalAmounts[expense.userId]) {
              finalAmounts[expense.userId] = 0;
            }
            finalAmounts[expense.userId] -= contribution.amount;
          }
        }
      });

      state.owesOwedData = finalAmounts;
    },
    resetExpanse: (state, action) => {
      state.expenses = [];
    },
    updateExpanse: (state, action) => {
      const { id, contributors } = action.payload;

      const expense = state.expenses.find((exp) => exp.id === id);

      if (expense) {
        contributors.forEach((updatedContributor) => {
          const contributor = expense.contributors.find(
            (c) => c.contributorId === updatedContributor.contributorId
          );

          if (contributor) {
            contributor.isSettled = updatedContributor.isSettled;
            contributor.amount = updatedContributor.amount;
          }
        });
      }
    },
  },
});

const settleAmountsBetweenUsers =
  (userId1, userId2) => (dispatch, getState) => {
    const state = getState();
    const expenses = state.expenses.expenses;

    const user1AsCreator = expenses.filter(
      (exp) =>
        exp.userId === userId1 &&
        exp.contributors.some(
          (c) => c.contributorId === userId2 && !c.isSettled
        )
    );

    const user2AsCreator = expenses.filter(
      (exp) =>
        exp.userId === userId2 &&
        exp.contributors.some(
          (c) => c.contributorId === userId1 && !c.isSettled
        )
    );

    let totalSettledAmount = 0;

    user1AsCreator.forEach((expense1) => {
      let contribution1 = expense1.contributors.find(
        (c) => c.contributorId === userId2
      );

      user2AsCreator.forEach((expense2) => {
        const contribution2 = expense2.contributors.find(
          (c) => c.contributorId === userId1
        );

        if (contribution1.amount > 0 && contribution2.amount > 0) {
          let amountToSettle = Math.min(
            contribution1.amount,
            contribution2.amount
          );

          let temp1 = {
            ...contribution1,
            amount: contribution1.amount - amountToSettle,
          };
          let temp2 = {
            ...contribution2,
            amount: contribution2.amount - amountToSettle,
          };

          totalSettledAmount += amountToSettle;

          if (contribution1.amount === 0) temp1.isSettled = true;
          if (contribution2.amount === 0) temp2.isSettled = true;

          dispatch(updateExpanse(expense1));
          dispatch(updateExpanse(expense2));
        }
      });
    });

    dispatch(calculateOwesAndOwed({ userId: userId1 }));
    dispatch(calculateOwesAndOwed({ userId: userId2 }));
  };

export const settleAllContributors =
  (currentUserId) => (dispatch, getState) => {
    const state = getState();
    const expenses = state.expenses.expenses;

    const userExpenses = expenses.filter(
      (exp) =>
        exp.userId === currentUserId ||
        exp.contributors.some((c) => c.contributorId === currentUserId)
    );

    userExpenses.forEach((expense) => {
      if (expense.userId === currentUserId) {
        expense.contributors.forEach((contributor) => {
          if (!contributor.isSettled) {
            dispatch(
              settleAmountsBetweenUsers(
                currentUserId,
                contributor.contributorId
              )
            );
          }
        });
      }

      const currentUserContribution = expense.contributors.find(
        (c) => c.contributorId === currentUserId
      );
      if (currentUserContribution && !currentUserContribution.isSettled) {
        dispatch(
          settleAmountsBetweenUsers(
            currentUserContribution.contributorId,
            expense.userId
          )
        );
      }
    });
  };

export const { addExpense, resetExpanse, calculateOwesAndOwed, updateExpanse } =
  expensesSlice.actions;
export default expensesSlice.reducer;
