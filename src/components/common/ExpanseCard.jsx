import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { settleAllContributors } from "../../redux/slices/expensesSlice";

const ExpanseCard = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.users.currentUser);
  const totalExpanse = useSelector((state) => {
    const { owesOwedData } = state.expenses;
    return Object.values(owesOwedData).reduce(
      (total, amount) => {
        if (amount > 0) total.owed += amount;
        else total.owe += amount;
        return total;
      },
      { owe: 0, owed: 0 }
    );
  });

  return (
    <div className="expanse-card">
      <div className="label-section">
        <div>
          <label>Total Owed:</label>
          <p>₹ {totalExpanse.owed}</p>
        </div>
        <div className="owe">
          <label>Total Owe:</label>
          <p>
            <p>₹ {totalExpanse.owe}</p>
          </p>
        </div>
      </div>
      <div class="progress">
        <div
          style={{
            width: `${
              !(totalExpanse.owed && totalExpanse.owed)
                ? 0
                : (Math.abs(totalExpanse.owed) * 100) /
                  (Math.abs(totalExpanse.owe) + Math.abs(totalExpanse.owed))
            }%`,
          }}
          class="progress-bar"
          role="progressbar"
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <button
        className="btn-filled"
        onClick={() => dispatch(settleAllContributors(currentUser?.userId))}
      >
        Auto Settle
      </button>
    </div>
  );
};

export default ExpanseCard;
