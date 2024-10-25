$('#driverApplicationForm').on('submit', function(e) {
    e.preventDefault();

    var formData = {
        full_name: $('#full_name').val(),
        // email: $('#email').val(),
        date_of_birth: $('#date_of_birth').val(),
        phone_number: $('#phone_number').val(),
        current_address: $('#current_address').val(),
        current_city: $('#current_city').val(),
        identification: $('#identification').val(),
        agree_to_share_info: $('#agree_to_share_info').is(':checked') ? 1 : 0, // boolean
        desired_driver_area: $('#desired_driver_area').val()

        // current_status: $('#current_status').val(),
        // region: $('#region').val(),
        // register_source: $('#register_source').val(),
    };

    $('#submitButton').prop('disabled', true);
    $('#loadingIcon').show();

    $.ajax({
        url: 'https://dev-quanly.butl.vn/api/driver-applicants', // Đường dẫn API
        method: 'POST',
        headers: {
        },
        data: formData,
        success: function(response) {
            if (response.code === 1) {
                Swal.fire({
                    title: 'Đăng ký thành công!',
                    icon: 'success',
                    confirmButtonText: 'Xác nhận',
                    confirmButtonColor: '#F47621',
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Reload lại trang sau khi bấm OK
                        window.location.replace("https://tuyentaixe.butl.vn/");
                    }

                    if(result.isDismissed) {
                        // Reload lại trang sau khi bấm OK
                        window.location.replace("https://tuyentaixe.butl.vn/");
                    }
                });
            } else {
                // Hiển thị lỗi nếu có
                Swal.fire({
                    title: 'Hệ thống quá tải, thử lại sau!',
                    icon: 'error',
                    confirmButtonText: 'Xác nhận',
                    confirmButtonColor: '#F47621',
                });
            }
        },
        error: function(xhr, status, error) {
            Swal.fire({
                title: xhr.responseJSON.message || 'Có lỗi xảy ra, vui lòng thử lại sau',
                icon: 'error',
                confirmButtonText: 'Đóng',
                confirmButtonColor: '#F47621',
            });
        },
        complete: function() {
            $('#submitButton').prop('disabled', false);
            $('#loadingIcon').hide();
        }
    });
});