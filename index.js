import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'

var MyBlog = React.createClass({
    
    render() {
        const {onAddClick, formDisplayed } = this.props
        return <div>
            <h1 className="page-header">My Blog</h1>
            <div className="col-md-8">
                <p><a className="btn btn-success" onClick={this.props.onAddClick}>Add Blog <span className="glyphicon glyphicon-pencil"></span></a></p>
                <form ref="addBlogForm" style={{display: this.props.formDisplayed?'block':'none'}}  onSubmit={this.handleForm}>
                    <div className="form-group">
                        <input ref="blogTitle" type="text" className="form-control" placeholder="New Blog Title" />
                    </div>
                    <p> <textarea ref="blogContent" className="form-control" rows="5" placeholder="New Blog Content"></textarea></p>
                    <a className="btn btn-warning" onClick={this.props.onAddClick}>Cancel <span className="glyphicon glyphicon-minus"></span></a>
                    <button className="btn btn-success pull-right">Submit <span className="glyphicon glyphicon-plus"></span></button>

                </form>
            </div>
        </div>
    },

});

MyBlog.propTypes = {
  onAddClick: PropTypes.func.isRequired,
  formDisplayed: PropTypes.bool.isRequired
}

// Action
const addFormDisplay = { type: 'TOGGLE_ADD' };

// Reducer
function addFormToggle(state = { formDisplayed: false }, action) {
    const formDisplayed = state.formDisplayed;
    switch (action.type) {

        case 'TOGGLE_ADD':
            return { formDisplayed: !formDisplayed };
        default:
            return state;
    }

};

// Store
const store = createStore(addFormToggle);

// Map Redux state to component props
function mapStateToProps(state) {
  return {
    formDisplayed: state.formDisplayed
  }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    onAddClick: () => dispatch(addFormDisplay)
  }
}

// Connected Component
// MyBlog = connect(
//   mapStateToProps,
//   mapDispatchToProps
// );

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(MyBlog)

// export default connect(mapStateToProps, mapDispatchToProps)(MyBlog)


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('myBlog')
);