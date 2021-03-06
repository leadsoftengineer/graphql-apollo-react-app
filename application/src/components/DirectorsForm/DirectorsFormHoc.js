import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { addDirectorMutation } from './mutations';
import { styles } from './styles';
import { directorsQuery } from '../DirectorsTable/queries';

const withGraphqlAdd = graphql(addDirectorMutation,{
    props: ({ mutate }) => ({
        addDirector: director => mutate({
           variables:director, 
           refetchQueries: [{ query: directorsQuery}],
        })
    })
});

export default compose(withStyles(styles),withGraphqlAdd);
