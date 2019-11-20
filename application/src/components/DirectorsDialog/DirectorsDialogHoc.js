import { compose } from 'recompose';
import { graphql } from 'react-apollo';

import { deleteDirectorMutation } from './mutations';
import { directorsQuery } from '../DirectorsTable/queries';

const withGraphDelete = graphql(deleteDirectorMutation, {
    props: ({ mutate }) => ({
          deleteDirector: id=>  mutate({
              variables:id,
              refetchQueries: [{ query: directorsQuery }],
          }),
    }),
});

export default compose (withGraphDelete);