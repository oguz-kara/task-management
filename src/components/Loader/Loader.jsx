import './loader.scss';
import { UilSpinner } from '@iconscout/react-unicons';

function Loader({ type = 'container' }) {
  if (type === 'container')
    return (
      <div className="container-loader">
        <div className="spinner text">
          <UilSpinner size="50" />
        </div>
      </div>
    );

  if (type === 'inline')
    return (
      <div className="inline-loader">
        <div className="spinner text">
          <UilSpinner size="30" />
        </div>
      </div>
    );
}

export default Loader;
