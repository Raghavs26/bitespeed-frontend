import { AiFillMessage } from "react-icons/ai";

import styles from "./MessageNode.module.css";

const MessageNode = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={styles.nodePanel}
      onDragStart={(event) => onDragStart(event, "textnode")}
      draggable
    >
      <AiFillMessage />
      <div>Message</div>
    </div>
  );
};

export default MessageNode;
