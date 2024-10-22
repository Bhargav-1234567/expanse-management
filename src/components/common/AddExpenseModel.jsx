import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import {
  addExpense,
  addRecalculateAndLogged,
  resetExpanse,
} from "../../redux/slices/expensesSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import {
  updateCurrentUserFriends,
  updateUserFriends,
} from "../../redux/slices/usersSlice";
import { addActivity } from "../../redux/slices/activitiesSlice";

const AddExpenseModel = () => {
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.users.currentUser.friends);
  const users = useSelector((state) => state.users.users);
  const currentUser = useSelector((state) => state.users.currentUser);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isUnequal, setIsUnequal] = useState(false);
  const [friendAmounts, setFriendAmounts] = useState({});
  const { removeQueryParam } = useCustomNavigation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const handleFriendChange = (friendId) => {
    setSelectedFriends((prev) => {
      if (prev.includes(friendId)) {
        return prev.filter((id) => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };

  const handleAmountChange = (friendId, amount) => {
    setFriendAmounts((prev) => ({
      ...prev,
      [friendId]: amount,
    }));
  };
  function getTemp(friendId) {
    let contributor = users.find((item) => item.userId === friendId);

    return { email: contributor.email, name: contributor.username };
  }
  const onSubmit = (data) => {
    if (selectedFriends.length === 0) {
      alert("Please Select at least on Contributor");
      return;
    }
    const { totalAmount, description } = data;
    let friendsTotal = Object.values(friendAmounts).reduce(
      (acc, value) => acc + Number(value),
      0
    );
    if (Number(totalAmount) < friendsTotal) {
      alert("Friends contribution total should not larger then Total Amount");
      return;
    }
    const expenseData = {
      id: uuidv4(),
      accessIds: [...selectedFriends, currentUser.userId],
      description,
      userId: currentUser.userId,
      totalAmount: parseFloat(totalAmount),
      contributors: selectedFriends.map((friendId) => ({
        ...getTemp(friendId),
        contributorId: friendId,
        isSettled: false,
        amount: isUnequal
          ? parseFloat(friendAmounts[friendId]) || 0
          : parseFloat(totalAmount) / selectedFriends.length,
      })),
    };

    dispatch(
      addRecalculateAndLogged({
        expense: expenseData,
        userId: currentUser.userId,
      })
    );

    dispatch(
      addActivity({
        isAdd: true,
        description: description,
        isSettlement: false,
        accessIds: [...selectedFriends, currentUser.userId],
        expanseId: expenseData.id,
        userId: expenseData.userId,
        userName: currentUser.username,
        contributors: expenseData.contributors,
        amount: expenseData.totalAmount,
        date: new Date().toISOString(),
      })
    );

    setSelectedFriends([]);
    setFriendAmounts({});
    setValue("totalAmount", "");
    setValue("description", "");
  };

  return (
    <div className="add-expanse-model">
      <div className="align-items-center d-flex justify-content-between mb-3">
        <h4 className="mb-0 mt-3">Add Expense</h4>
        <FontAwesomeIcon
          icon={faClose}
          onClick={() => removeQueryParam("addExpanse")}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-item">
          <input
            type="number"
            className="w-100"
            placeholder="Total Amount"
            {...register("totalAmount", {
              required: "Total amount is required",
              min: { value: 0, message: "Amount must be positive" },
            })}
          />
          {errors.totalAmount && (
            <p className="error-message">{errors.totalAmount.message}</p>
          )}
        </div>
        <div className="form-item">
          <input
            className="w-100"
            type="text"
            placeholder="Description"
            {...register("description")}
          />
        </div>
        <div className="align-items-center d-flex gap-2 mb-2">
          <label className="form-check-label">Equally</label>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              checked={isUnequal}
              onChange={() => setIsUnequal(!isUnequal)}
            />
            <label className="form-check-label mt-1">Unequally</label>
          </div>
        </div>

        <div>
          <h6 className="select-cont-header">Select contributors</h6>
          {friends.map((friend) => (
            <div key={friend.userId}>
              <div className="align-items-center d-flex gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  id={friend.userId}
                  checked={selectedFriends.includes(friend.userId)}
                  onChange={() => handleFriendChange(friend.userId)}
                />
                <label htmlFor={friend.userId}>{friend.name}</label>
              </div>
              {isUnequal && selectedFriends.includes(friend.userId) && (
                <input
                  type="number"
                  placeholder="Amount"
                  onChange={(e) =>
                    handleAmountChange(friend.userId, e.target.value)
                  }
                />
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="btn-filled w-100 py-1">
          Add Expense
        </button>
        <button
          title="For dev mode (reset expanse)"
          className="btn-bordered p-2 mt-2"
          type="button"
          onClick={() => dispatch(resetExpanse())}
        >
          Reset
        </button>
      </form>
    </div>
  );
};

export default AddExpenseModel;
