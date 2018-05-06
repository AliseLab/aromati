/**
 * Upload the photos using ajax request.
 *
 * @param formData
 */
function uploadFiles(formData) {
    $.ajax({
        url: '/upload_photos',
        method: 'post',
        data: formData,
        processData: false,
        contentType: false,
        xhr: function () {
            var xhr = new XMLHttpRequest();

            return xhr;
        }
    }).done(handleSuccess).fail(function (xhr, status) {
        // error?
    });
}

/**
 * Handle the upload response data from server and display them.
 *
 * @param data
 */
function handleSuccess(data) {
    if (data.length > 0) {
        data = data[0];
        var img = $( '<img/>' )
        	.attr( 'src', data.publicPath )
        	.attr( 'alt', data.filename )
        ;
        var block = $( '.imageblock[data-imgid="' + data.imgid + '"]' );
        block.html( '' )
        img.appendTo( block );
    } else {
        //alert('No images were uploaded.')
    }
}

$('#photos-input').on('change', function () {
    $( '#upload-photos' ).submit();
});

// On form submit, handle the file uploads.
$('#upload-photos').on('submit', function (event) {
    event.preventDefault();

    // Get the files from input, create new FormData.
    var files = $('#photos-input').get(0).files,
        formData = new FormData();

    if ( files.length > 0 ) {
        var file = files[ 0 ];
        formData.append('photos[]', file, file.name);
    	formData.append( 'imgid', $(this).attr( 'data-imgid' ) );
    	
	    uploadFiles(formData);
    }
    
});
