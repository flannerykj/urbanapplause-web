import React, { Component } from 'react';
import AppContext from './AppContext';

class AppProvider extends Component {
    state = {
        language: 'en'
    };
    componentWillReceiveProps(nextProps) {
    }
    render() {
        return (
            <AppContext.Provider
                value={{
                    language: this.state.language,
                    changeLanguage: language => {
                        this.setState({
                            language
                        });
                    },
                }}
            >
                {this.props.children}
            </AppContext.Provider>
        );
    }
}

export default AppProvider;
