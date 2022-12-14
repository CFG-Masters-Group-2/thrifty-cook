import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function StarredButton(props) {

    return (
        <TouchableOpacity onPress={props.onPress2} activeOpacity={0.7}>
            <Ionicons color='#e58637' size={30} name={props.isClicked ? 'star' : 'star-outline'} />
        </TouchableOpacity >
    );
}



