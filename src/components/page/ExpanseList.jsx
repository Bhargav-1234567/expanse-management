import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  settleAndRecalculate,
  updateExpanse,
} from "../../redux/slices/expensesSlice";
import { addActivity } from "../../redux/slices/activitiesSlice";

const ExpanseList = () => {
  const expanseList = useSelector((state) => state.expenses.expenses);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users?.users);
  const currentUser = useSelector((state) => state.users?.currentUser);
  const currentUserId = currentUser?.userId;
  const handleSettleExpense = (
    expenseId,
    contributorId,
    contributorName,
    expenseDescription,
    contributionAmount
  ) => {
    const expense = expanseList.find((exp) => exp.id === expenseId);
    const updatedContributors = expense.contributors.map((contributor) => {
      if (contributor.contributorId === contributorId) {
        return { ...contributor, isSettled: true };
      }
      return contributor;
    });

    dispatch(
      addActivity({
        isAdd: false,
        description: expenseDescription,
        isSettlement: true,
        expanseId: expenseId,
        userId: currentUserId,
        userName: currentUser.username,
        contributorName: contributorName,
        contributorId: contributorId,
        amount: contributionAmount,
        accessIds: [contributorId, currentUser.userId],
        date: new Date().toISOString(),
      })
    );

    let updatedExpanse = {
      ...expense,
      contributors: updatedContributors,
    };

    dispatch(settleAndRecalculate({ updatedExpanse, userId: currentUserId }));
  };
  const getUserName = (userId) => {
    const user = users.find((user) => user.userId === userId);
    return user ? user.username : "Unknown User";
  };
  return (
    <div className="expanse-list">
      {expanseList.length === 0 && (
        <div className="align-items-center d-flex justify-content-center mt-3">
          No Expanse Yet!
        </div>
      )}
      {expanseList.map((expense) => (
        <>
          {expense.accessIds?.includes(currentUserId) ? (
            <div key={expense.id} className="expanse-list-item">
              <div className="align-items-center d-flex justify-content-between">
                <h3 className="desc"> {expense.description}</h3>
                <p className="amount"> ₹ {expense.totalAmount}</p>
              </div>
              <p className="user">
                Done by :{" "}
                {expense.userId === currentUserId
                  ? "You"
                  : getUserName(expense.userId)}
              </p>

              {/* Displaying the user who added the expense */}
              <h6>Contributors</h6>
              <div className="contributors-list">
                {(expense.userId === currentUserId
                  ? [...expense.contributors]
                  : expense.contributors.filter(
                      (item) => item.contributorId === currentUserId
                    )
                ).map((contributor) => (
                  <div
                    className="list-item p-2 mb-2"
                    key={contributor.contributorId}
                  >
                    <div className="inner-grid">
                      <div className="profile">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <div className="contributor">
                        {contributor.contributorId === currentUserId
                          ? "You"
                          : getUserName(contributor.contributorId)}
                      </div>

                      <div className="contribution-amount">
                        ₹ {contributor.amount}
                      </div>
                    </div>
                    <div className="align-items-end d-flex justify-content-between">
                      <div
                        className={`${
                          contributor.isSettled ? "owed" : "owe"
                        } status`}
                      >
                        {contributor.isSettled ? "Settled" : "Not Settled"}
                      </div>

                      {expense.userId === currentUserId &&
                        !contributor.isSettled && (
                          <button
                            className="btn-filled"
                            onClick={() =>
                              handleSettleExpense(
                                expense.id,
                                contributor.contributorId,
                                contributor.name,
                                expense.description,
                                contributor.amount
                              )
                            }
                          >
                            Settled
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ))}
    </div>
  );
};

export default ExpanseList;
