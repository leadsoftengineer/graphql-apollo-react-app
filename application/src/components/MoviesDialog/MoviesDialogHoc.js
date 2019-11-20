import { compose } from 'recompose';
import { graphql } from 'react-apollo';

import { deleteMovieMutation} from './mutations';
import { moviesQuery } from '../MoviesTable/queries';

const withGraphDelete = graphql(deleteMovieMutation,
    {
         props: ({ mutate}) =>({
             deleteMovie: id =>mutate({
                 variables:id,
                 refetchQueries: [{query: moviesQuery}],
             }),
         }),
    });

    export default compose (withGraphDelete);