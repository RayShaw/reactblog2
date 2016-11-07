var React = require('react');
var ReactDOM = require('react-dom');
// var store = require('../../store/main');
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'

// var redux = require('react-redux')
// redux.Provider;


var MyBlog = React.createClass({

	getInitialState: function(){
        var soureData = localStorage.getItem('data');
        var blogsArrData = (soureData == '' || soureData == null) ? [] : JSON.parse(soureData);
        if(blogsArrData.length > 0) blogsArrData = this.sortBlog(blogsArrData);
        return {
            blogsArr: blogsArrData,
            formDisplayed: false,

        };
	},
    onToggleForm: function (){
        this.setState({
            formDisplayed : !this.state.formDisplayed,
        });
    },
    onNewBlog: function(newBlog){
        var newBlogs;
        if(this.state.blogsArr.length > 0){
            newBlogs = this.state.blogsArr.concat(newBlog);
            newBlogs = this.sortBlog(newBlogs);
        } else {
            newBlogs = [];
            newBlogs.push(newBlog);
        }


        this.setState({
            blogsArr: newBlogs,
            formDisplayed: false,
        });

        localStorage.setItem('data',JSON.stringify(newBlogs));

    },
    onUpdateBlog:function(updateBlog){
        var allBlogs = this.state.blogsArr;

		allBlogs.forEach(function(blog, index){
			if(blog.id == updateBlog.id){
				allBlogs.splice(index, 1);
				allBlogs = allBlogs.concat(updateBlog);
				return;
			}
		});

        allBlogs = this.sortBlog(allBlogs);

        this.setState({
            blogsArr: allBlogs,
        });

        localStorage.setItem('data',JSON.stringify(allBlogs));
    },
    onDeleteBlog:function(id){
        var allBlogs = this.state.blogsArr;
        allBlogs.forEach(function(blog, index){
            if(blog.id == id){
                allBlogs.splice(index, 1);
                return;
            }
        });

        allBlogs = this.sortBlog(allBlogs);

        this.setState({
            blogsArr: allBlogs,
        });

        localStorage.setItem('data',JSON.stringify(allBlogs));
    },
    sortBlog: function(newBlogs){
        newBlogs.sort(function(a,b){
            return b.timeLong - a.timeLong;
        });
        return newBlogs;
        
    },
	render() {
		return <div>
            <h1 className="page-header">My Blog</h1>
            <AddBlog onToggleForm={this.onToggleForm} formDisplayed={this.state.formDisplayed} onNewBlog={this.onNewBlog}/>
            <AllBlogs blogsArr={this.state.blogsArr} onUpdateBlog={this.onUpdateBlog} onDeleteBlog={this.onDeleteBlog}/>
            
        </div>;
	}

});

var AllBlogs = React.createClass({

    render: function() {
        var onUpdateBlog = this.props.onUpdateBlog;
        var onDeleteBlog = this.props.onDeleteBlog;
        var oneBlog;

        var first20Content;

        var blogsArr = this.props.blogsArr;
        var blogsDisplay = [];
        if(blogsArr != null && blogsArr.length > 0){
            blogsArr.forEach(function(blog, index){
                oneBlog = blog;
                first20Content = blog.content.length > 20 ? blog.content.substring(0,20) + ' ... ' : blog.content;
                blogsDisplay.push(
                    <div key={'blog' + index}>
                        <h3>{blog.title}:</h3>
                        <p><span className="glyphicon glyphicon-time"></span> Posted on {blog.time}</p>
                        <h4>{first20Content}</h4>
                        <DetailBlog blog={oneBlog} onUpdateBlog={onUpdateBlog} onDeleteBlog={onDeleteBlog}/>
                        <hr/>
                    </div>
                );
            });
        }else{
            blogsDisplay.push(
                <span key={'blog' + 0}> There is no blog.</span>
            );
        }

        return <div className="col-md-8">
           {blogsDisplay}
        </div>;
    }
});

var DetailBlog = React.createClass({

    getInitialState: function(){
        return {
            blogDetailDisplay : false,
            moreButtonText:'More',
            moreButtonIcon:'glyphicon glyphicon-chevron-right',
        }
    },

    onToggleDetailForm: function (){
        this.refs.detailForm.reset();
        this.setState({
            blogDetailDisplay : !this.state.blogDetailDisplay,
            moreButtonText: !this.state.blogDetailDisplay ? 'Collapse' : 'More',
            moreButtonIcon: !this.state.blogDetailDisplay ? 'glyphicon glyphicon-chevron-left' : 'glyphicon glyphicon-chevron-right',
        });
    },

    handleUpdate: function(e){
		e.preventDefault();
		var updateBlog = {
			id: this.props.blog.id,
			title: this.refs.updateTitle.value,
            content: this.refs.updateContent.value,
            time: new Date().toString(),
            timeLong: new Date().getTime(),
		}


        this.setState({
            blogDetailDisplay: false,
            moreButtonText:'More',
            moreButtonIcon:'glyphicon glyphicon-chevron-right',
        });

        // this.refs.detailForm.reset();

		this.props.onUpdateBlog(updateBlog);
		
		
	},

    handleDelete: function(e){
		e.preventDefault();

		if(window.confirm('Sure Delete this Blog??')){

			this.setState({
                blogDetailDisplay: false,
                moreButtonText:'More',
                moreButtonIcon:'glyphicon glyphicon-chevron-right',
            });

            // this.refs.detailForm.reset();

            this.props.onDeleteBlog(this.props.blog.id);
		}
	},

    render: function() {
        var stylesObj = {
            display: this.state.blogDetailDisplay ? 'block' : 'none'
        };
        return <div>
            <p><a className="btn btn-primary" onClick={this.onToggleDetailForm}>{this.state.moreButtonText} <span className={this.state.moreButtonIcon}></span></a></p>
            <form ref="detailForm" className="well" style={stylesObj}>
                <p><a className="btn btn-danger pull-right" onClick={this.handleDelete}>Delete <span className="glyphicon glyphicon-minus"></span></a></p>
                <p><label>Blog Title :</label></p>
                <p><input ref="updateTitle" type="text" className="form-control" placeholder="Blog Title" defaultValue={this.props.blog.title}/></p>
                <p><label>Blog Content :</label></p>
                <p><textarea ref="updateContent" className="form-control" rows ="5" placeholder="Blog Content" defaultValue={this.props.blog.content}></textarea></p>
                <p><a className="btn btn-success pull-right" onClick={this.handleUpdate}>Update <span className="glyphicon glyphicon-plus"></span></a></p>
                <br/>
            </form>
        </div>

    }   
});

var AddBlog = React.createClass({
    handleForm: function(e){
        e.preventDefault();
        var newBlog ={
            id: new Date().getTime(),
            title: this.refs.blogTitle.value,
            content: this.refs.blogContent.value,
            time: new Date().toString(),
            timeLong: new Date().getTime(),
        };
        //ReactDOM.findDOMNode(this.refs.addBlogForm).reset();

        this.refs.addBlogForm.reset();

        this.props.onNewBlog(newBlog);
    },
    render: function(){
        var stylesObj={
            display: this.props.formDisplayed ? 'block' : 'none'
        };
        return <div className="col-md-8">
            <p><a className="btn btn-success" onClick={this.props.onToggleForm}>Add Blog <span className="glyphicon glyphicon-pencil"></span></a></p>
			<form ref="addBlogForm" style={stylesObj} onSubmit={this.handleForm}>
				<div className="form-group">
					<input ref="blogTitle" type="text" className="form-control" placeholder="New Blog Title"/>	
				</div>
				<p> <textarea ref="blogContent" className="form-control" rows ="5" placeholder="New Blog Content"></textarea></p>
                <a className="btn btn-warning" onClick={this.props.onToggleForm}>Cancel <span className="glyphicon glyphicon-minus"></span></a>
				<button className="btn btn-success pull-right">Submit <span className="glyphicon glyphicon-plus"></span></button>  
				
			</form>
        </div>
    }
});



ReactDOM.render(
  <MyBlog />,
  document.getElementById('myBlog')
);