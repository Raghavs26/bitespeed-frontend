import { BiSolidMessage } from "react-icons/bi";
import { Handle, Position } from "reactflow";
import PropTypes from "prop-types";
import styles from "./CustomNode.module.css"; // Import the CSS module

const CustomNode = ({ data, selected }) => {
  return (
    <div className={`${styles.customNode} ${selected ? styles.selected : ""}`}>
      <div className={styles.header}>
        <BiSolidMessage />
        <p className={styles.msg}>Send Message</p>
      </div>
      <div className={styles.content}>{data.label ?? "Text Node"}</div>
      <Handle
        id="a"
        type="target"
        position={Position.Left}
        className={styles.handleTarget}
      />
      <Handle
        id="b"
        type="source"
        position={Position.Right}
        className={styles.handleSource}
      />
    </div>
  );
};

CustomNode.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
};

export default CustomNode;
