import classes from "./Sidebar.module.css";
import ItemInput from "../Item/ItemInput";
import ItemStats from "../Item/ItemStats";
const Sidebar = (props) => {
  return (
    <div className={classes.sidebar}>
      <ItemInput
        addItemHandler={props.addItemHandler}
        numItems={props.stats.totalItems}
        loadDemoHandler={props.loadDemoHandler}
      />
      <ItemStats stats={props.stats} />
    </div>
  );
};

export default Sidebar;
