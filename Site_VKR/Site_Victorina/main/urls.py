from django.urls import path

from . import views


urlpatterns = [
    #Главное меню
    path('',views.index,name='main'),
    
    #Форма авторизаций
    path('LogIn',views.logIn,name='autorize'),


    #Авторизация
    path('SignInUser',views.signInUser,name='sign_in_user'),
    path('SignInAdmin',views.signInAdmin,name='sign_in_admin'),


    path('StudentStart',views.studentVictorina,name='student_begin_victorina'),
    path(r'^Victorina/d+/$',views.startVictorina,name='startVictorina'),

    path('AdminForm',views.adminForm,name='admin_form'),
    
    path('GetVictorinaAndGetResultPlaygrouthCreate',views.GetVictorinaAndGetResultPlaygrouthCreate,name='get_victorina_get_result_playgrouth_create'),

    path('ResultVictorina',views.resultVictorina,name='result_victorina')

]
