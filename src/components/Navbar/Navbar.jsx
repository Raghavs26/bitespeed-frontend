import PropTypes from "prop-types";
import styles from "./Navbar.module.css";

const Navbar = ({ onSave }) => {
  return (
    <nav className={styles.navbar}>
      <div className="navbar-content">
        <button className={styles["navbar-button"]} onClick={onSave}>
          Save Flow
        </button>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  onSave: PropTypes.func.isRequired,
};

export default Navbar;
