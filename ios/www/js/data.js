var kustomNote = angular.module('kustomNote');

// Menu Data: Menu configuration
kustomNote.factory('MenuData', function(){
    var data = {};
    
    data.items = [
        { 
            title: 'Create Notes',
            icon: 'plus',
            page: 'home.html'
        },
        { 
            title: 'Pending Notes',
            icon: 'edit',
            page: 'noteList.html'
        },
        { 
            title: 'Sync',
            icon: 'refresh',
            page: 'home.html'
        },
        { 
            title: 'Logout',
            icon: 'sign-out',
            page: 'login.html'
        }
    ]; 
    
    return data;
});

kustomNote.factory('GalleryData', function(){
    var data = {};
    
    data.items = [
        { 
            label: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            src: 'img/gallery-1.jpg',
            location: 'New York, June 2014'
        },
        { 
            label: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
            src: 'img/gallery-2.jpg',
            location: 'Athens, August 2013'
        },
        { 
            label: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            src: 'img/gallery-3.jpg',
            location: 'Tokyo, May 2013'
        }
    ]; 
    
    return data;
});


// Filed Type configuration
kustomNote.factory('FieldTypeData', function(){
    var data = {};
    
    data.items = [
        { 
            title: 'One line text',
            name: '',
            valid: 0,
            src: 'text.html'
        },
        { 
            title: 'Multiple line text',
            name: '',
            valid: 0,
            src: 'textarea.html'
        },
        { 
            title: 'Check box',
            name: '',
            valid: 0,
            src: 'checkbox.html'
        },
        { 
            title: 'Date',
            name: '',
            valid: 0,
            src: 'date.html'
        },
        { 
            title: 'Date Time',
            name: '',
            valid: 0,
            src: 'datetime.html'
        },
        { 
            title: 'Email',
            name: '',
            valid: 0,
            src: 'email.html'
        },
        { 
            title: 'File',
            name: '',
            valid: 0,
            src: 'file.html'
        },
        { 
            title: 'Google calendar',
            name: '',
            valid: 0,
            src: 'google_calendar.html'
        },
        { 
            title: 'Google Contact',
            name: '',
            valid: 0,
            src: 'google_contact.html'
        },
        { 
            title: 'Movie',
            name: '',
            valid: 0,
            src: 'movie.html'
        },
        { 
            title: 'Multiple Check box',
            name: '',
            valid: 0,
            src: 'multi_checkbox.html'
        },
        { 
            title: 'Music',
            name: '',
            valid: 0,
            src: 'music.html'
        },
        { 
            title: 'Number',
            name: '',
            valid: 0,
            src: 'number.html'
        },
        { 
            title: 'Number Range',
            name: '',
            valid: 0,
            src: 'number_range.html'
        },
        { 
            title: 'Multiple choise options',
            name: '',
            valid: 0,
            src: 'radio_group.html'
        },
        { 
            title: 'Select Mulitple',
            name: '',
            valid: 0,
            src: 'select_multiple.html'
        },
        { 
            title: 'Select Single',
            name: '',
            valid: 0,
            src: 'select_single.html'
        },
        { 
            title: 'Time',
            name: '',
            valid: 0,
            src: 'time.html'
        },
        { 
            title: 'URL',
            name: '',
            valid: 0,
            src: 'url.html'
        }
    ]; 
    
    return data;
});

// bottom menu: Mobile Plugins configuration
kustomNote.factory('BottomMenuData', function(){
    var data = {};
    
    data.items = [
        { 
            title: 'Notes',
            icon: 'file-o',
            page: 'recent_notes.html',
            active: ''
        },
        { 
            title: 'Templates',
            icon: 'list-alt',
            page: 'home.html',
            active: ''
        },
        { 
            title: 'Search',
            icon: 'search',
            page: 'search.html',
            active: ''
        },
        { 
            title: 'Setting',
            icon: 'cog',
            page: 'setting.html',
            active: ''
        }
    ]; 
    
    return data;
});

kustomNote.factory('selectedTemplateData', function(){
                   var data = { selectedItem: '' , selectedField:''};
                   return data;
});

// newNoteData configuration
kustomNote.factory('newNoteData', function(){
    var data = { selectedItem: '' };
    return data;
});

kustomNote.factory('noteDetailData', function(){
    var data = { selectedItem: '' };
    return data;
});

kustomNote.factory('templateDetailData', function(){
    var data = { selectedItem: '' };
    return data;
});

kustomNote.factory('SearchResultData', function(){
                   var data = {selectedFields:"", template_id:""  };
                   return data;
                   });
kustomNote.factory('notesDataOfTemplate', function(){
                   var data = {notes:"" };
                   return data;
                   });


