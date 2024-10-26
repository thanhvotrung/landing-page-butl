// $('#driverApplicationForm').on('submit', function(e) {
//     e.preventDefault();
//
//     var formData = {
//         full_name: $('#full_name').val(),
//         // email: $('#email').val(),
//         date_of_birth: $('#date_of_birth').val(),
//         phone_number: $('#phone_number').val(),
//         current_address: $('#current_address').val(),
//         current_city: $('#current_city').val(),
//         identification: $('#identification').val(),
//         agree_to_share_info: $('#agree_to_share_info').is(':checked') ? '1' : '0', // boolean
//         desired_driver_area: $('#desired_driver_area').val()
//
//         // current_status: $('#current_status').val(),
//         // region: $('#region').val(),
//         // register_source: $('#register_source').val(),
//     };
//
//     // $('#submitButton').prop('disabled', true);
//     // $('#loadingIcon').show();
//
//     // $.ajax({
//     //     type: 'POST',
//     //     contentType: 'application/json',
//     //     url: 'https://api-khach-v2.bship.vn/api/landing/driver/applicants',
//     //     data: JSON.stringify(formProps),
//     //     crossDomain: true,
//     //     success: function (response) {
//     //         if (response?.applicant) {
//     //             const notiModal = document.getElementById('noti-modal');
//     //             notiModal.classList.remove('hidden');
//     //         }
//     //         document.getElementById('form-dang-ky').reset();
//     //     },
//     //     error: function (xhr, status, error) { },
//     // });
//
//     $.ajax({
//         url: 'https://quanly.butl.vn/api/driver-applicants', // Đường dẫn API
//         // url: 'https://dev-quanly.butl.vn/api/driver-applicants', // Đường dẫn API
//         method: 'POST',
//         contentType: 'application/json',
//         data: JSON.stringify(formData),
//         crossDomain: true,
//         success: function(response) {
//             if (response.code === 1) {
//                 Swal.fire({
//                     title: 'Đăng ký thành công!',
//                     icon: 'success',
//                     confirmButtonText: 'Xác nhận',
//                     confirmButtonColor: '#F47621',
//                 }).then((result) => {
//                     if (result.isConfirmed) {
//                         // Reload lại trang sau khi bấm OK
//                         window.location.replace("https://tuyentaixe.butl.vn/");
//                     }
//
//                     if(result.isDismissed) {
//                         // Reload lại trang sau khi bấm OK
//                         window.location.replace("https://tuyentaixe.butl.vn/");
//                     }
//                 });
//             } else {
//                 // Hiển thị lỗi nếu có
//                 Swal.fire({
//                     title: 'Hệ thống quá tải, thử lại sau!',
//                     icon: 'error',
//                     confirmButtonText: 'Xác nhận',
//                     confirmButtonColor: '#F47621',
//                 });
//             }
//         },
//         error: function(xhr, status, error) {
//             Swal.fire({
//                 title: xhr.responseJSON.message || 'Có lỗi xảy ra, vui lòng thử lại sau',
//                 icon: 'error',
//                 confirmButtonText: 'Đóng',
//                 confirmButtonColor: '#F47621',
//             });
//         },
//         complete: function() {
//             // $('#submitButton').prop('disabled', false);
//             // $('#loadingIcon').hide();
//         }
//     });
// });

$('#driverApplicationForm').on('submit', function(e) {
    e.preventDefault();

    // Disable nút submit và hiện loading
    const $submitButton = $('#submitButton');
    const $loadingIcon = $('#loadingIcon');

    $submitButton.prop('disabled', true);
    $loadingIcon.show();

    const formData = {
        full_name: $('#full_name').val().trim(),
        date_of_birth: $('#date_of_birth').val().trim(),
        phone_number: $('#phone_number').val().trim(),
        current_address: $('#current_address').val().trim(),
        current_city: $('#current_city').val().trim(),
        identification: $('#identification').val().trim(),
        agree_to_share_info: $('#agree_to_share_info').is(':checked') ? '1' : '0',
        desired_driver_area: $('#desired_driver_area').val().trim()
    };

    // Basic validation trước khi gửi request
    if (!formData.phone_number || formData.phone_number.length !== 10) {
        Swal.fire({
            title: 'Số điện thoại không hợp lệ!',
            icon: 'error',
            confirmButtonText: 'Đóng',
            confirmButtonColor: '#F47621',
        });
        $submitButton.prop('disabled', false);
        $loadingIcon.hide();
        return;
    }

    $.ajax({
        url: 'https://quanly.butl.vn/api/driver-applicants',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        crossDomain: true,
        success: function(response) {
            if (response.code === 1) {
                // Reset form
                $('#driverApplicationForm')[0].reset();

                Swal.fire({
                    title: 'Đăng ký thành công!',
                    text: 'Cảm ơn bạn đã đăng ký. Chúng tôi sẽ liên hệ với bạn sớm nhất!',
                    icon: 'success',
                    confirmButtonText: 'Xác nhận',
                    confirmButtonColor: '#F47621',
                }).then(() => {
                    window.location.replace("https://tuyentaixe.butl.vn/");
                });
            } else {
                Swal.fire({
                    title: 'Có lỗi xảy ra!',
                    text: response.message || 'Hệ thống quá tải, vui lòng thử lại sau',
                    icon: 'error',
                    confirmButtonText: 'Đóng',
                    confirmButtonColor: '#F47621',
                });
            }
        },
        error: function(xhr, status, error) {
            let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại sau';

            try {
                // Xử lý các mã lỗi khác nhau
                switch(xhr.status) {
                    case 422: // Validation error
                        errorMessage = xhr.responseJSON.message;
                        break;
                    case 429: // Too many requests
                        errorMessage = 'Quá nhiều yêu cầu, vui lòng thử lại sau';
                        break;
                    case 500: // Server error
                        errorMessage = 'Lỗi hệ thống, vui lòng thử lại sau';
                        break;
                    default:
                        if (xhr.responseJSON && xhr.responseJSON.message) {
                            errorMessage = xhr.responseJSON.message;
                        }
                }
            } catch (e) {
                console.error('Error parsing response:', e);
            }

            Swal.fire({
                title: 'Thông báo',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Đóng',
                confirmButtonColor: '#F47621',
            });
        },
        complete: function() {
            $submitButton.prop('disabled', false);
            $loadingIcon.hide();
        }
    });
});

// Thêm validation cho số điện thoại
$('#phone_number').on('input', function() {
    const value = $(this).val().replace(/\D/g, '');
    $(this).val(value.substring(0, 10));
});

// Thêm validation cho ngày sinh
$('#date_of_birth').on('change', function() {
    const dob = new Date($(this).val());
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();

    if (age < 18) {
        Swal.fire({
            title: 'Thông báo',
            text: 'Bạn phải đủ 18 tuổi để đăng ký!',
            icon: 'warning',
            confirmButtonText: 'Đóng',
            confirmButtonColor: '#F47621',
        });
        $(this).val('');
    }
});