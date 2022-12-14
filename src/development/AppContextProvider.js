import React, { Component } from 'react';
import { LightGreen } from './Themes';
import { DarkTheme } from '@react-navigation/native';

const Context = React.createContext();

export class AppContextProvider extends Component {
    state = {
        theme: LightGreen,
        updateTheme: (theme) => {
            this.setState({ theme: theme })
        }
    }
    
    render() {
        const { theme } = this.state
        return (
            <Context.Provider value={ this.state }  theme={ theme } >
                    { this.props.children }
            </Context.Provider>
        )
    }
}

export const AppConsumer = Context.Consumer;
export const AppContext = Context;