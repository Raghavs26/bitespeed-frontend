import PropTypes from "prop-types";
import { IoArrowBack } from "react-icons/io5";

import styles from "./Sidebar.module.css";

import MessageNode from "../MessageNode/MessageNode";

const Sidebar = ({
  nodeName,
  setNodeName,
  selectedNode,
  setSelectedElements,
}) => {
  const handleInputChange = (event) => {
    setNodeName(event.target.value);
  };

  const handleGoBack = () => {
    setSelectedElements([]);
  };

  return (
    <aside className={styles.sidebar}>
      {selectedNode ? (
        <div>
          <div className={styles.headerContainer}>
            <IoArrowBack onClick={handleGoBack} className={styles.backButton} />
            <h3 className={styles.header}>Message</h3>
          </div>
          <label className={styles.label}>Text</label>
          <input
            type="text"
            className={styles.input}
            value={nodeName}
            onChange={handleInputChange}
          />
        </div>
      ) : (
        <div className={styles.nodePanel}>
          <MessageNode />
        </div>
      )}
    </aside>
  );
};

Sidebar.propTypes = {
  nodeName: PropTypes.string.isRequired,
  setNodeName: PropTypes.func.isRequired,
  selectedNode: PropTypes.object,
  setSelectedElements: PropTypes.func.isRequired,
};

export default Sidebar;
