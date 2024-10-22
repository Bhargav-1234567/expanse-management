import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../utils/formatDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { resetActivity } from "../../redux/slices/activitiesSlice";

const Activity = () => {
  const activityList = useSelector((state) => state.activities.activities);
  const currentUser = useSelector((state) => state.users.currentUser);
  const [expanded, setExpanded] = useState(null);
  const dispatch = useDispatch();

  return (
    <div className="activity-container">
      <h6 className="my-3">Your Expanse and Settlement Activity</h6>
      <div className="list">
        {activityList.map((item) => {
          if (item.accessIds.includes(currentUser.userId)) {
            return (
              <div className="list-item">
                <div className="message">
                  {item.isAdd ? (
                    currentUser.userId === item.userId ? (
                      "You Added Expanse For" + (item.description || "Unknown")
                    ) : (
                      item?.userName +
                      " " +
                      "Added Expanse For" +
                      (item.description || "Unknown")
                    )
                  ) : (
                    <></>
                  )}
                  <div className="amount">₹ {item.amount}</div>
                </div>

                {expanded === item.expanseId && (
                  <div className="contributors-list">
                    <div className="contributors-head">contributors</div>
                    {item.contributors?.map((contributor) => (
                      <div
                        className="c-list-item"
                        key={contributor.contributorId}
                      >
                        <div className="profile">
                          <FontAwesomeIcon icon={faUser} />
                        </div>
                        <div className="name"> {contributor.name} </div>
                        <div className="amount">₹ {contributor.amount}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="details-sec">
                  <div className="details-link">
                    {expanded === item.expanseId ? (
                      <span onClick={() => setExpanded(null)}>
                        <FontAwesomeIcon icon={faChevronUp} />
                        Hide Details
                      </span>
                    ) : (
                      <span onClick={() => setExpanded(item.expanseId)}>
                        <FontAwesomeIcon icon={faChevronDown} />
                        Show Details
                      </span>
                    )}
                  </div>
                  <div className="date">{formatDate(item.date)}</div>
                </div>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
      <button
        title="For dev mode (reset Activity)"
        className="btn-bordered p-2 mt-1"
        onClick={() => dispatch(resetActivity())}
      >
        Reset
      </button>
    </div>
  );
};

export default Activity;
