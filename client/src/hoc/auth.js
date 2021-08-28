import axios from 'axios';
import React,{useEffect} from 'react';
import { useDispatch } from 'react-redux';
import {auth} from '../_actions/user_action';

export default function(SpecificComponent, option, adminRoute = null){  
    // adminRoute는 default 값이 null이지만 true로 해주면 어드민만 들어갈 수 있게 해줄 수 있음
    //null => 아무나 출입 가능
    //true => 로그인한 유저만 출입이 가능한 페이지
    //false => 로그인한 유저는 출입 불가능한 페이지
    function AuthenticationCheck(props){
        const dispatch = useDispatch();
        useEffect(() => {
            
            dispatch(auth()).then(response =>{
                console.log(response)
                //로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    if(option){
                        props.history.push('/login');
                    }
                }else{
                    //로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin){
                        props.history.push('/')
                    }else{
                        if(option === false){
                            props.history.push('/')
                        }
                    }
                }
            })
        }, [])
        return (
            <SpecificComponent/>
        )
    }
    return AuthenticationCheck
}