import './list.scss';

function List({ children, ...props }) {
  return (
    <ul className="list background" {...props}>
      {children}
    </ul>
  );
}

function ListItem({ children, className, background = 'background', ...props }) {
  return (
    <li className={`list-item text ${className} ${background}`} {...props}>
      {children}
    </li>
  );
}

List.Item = ListItem;

export default List;
