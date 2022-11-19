import './list.scss';

function List({ children, ...props }) {
  return (
    <ul className="list background" {...props}>
      {children}
    </ul>
  );
}

function ListItem({ children, className, ...props }) {
  return (
    <li className={`list-item text background ${className}`} {...props}>
      {children}
    </li>
  );
}

List.Item = ListItem;

export default List;
