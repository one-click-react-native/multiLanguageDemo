import React, { useState } from 'react';
import {StyleSheet,View,Text,I18nManager, TouchableOpacity} from 'react-native';
import * as Localize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import Modal from 'react-native-modal';
import RadioButton from 'radio-buttons-react-native';


const App=props=>{

  const [languageValue,setLanguageValue]=useState({
    languageTag:'en',
    isRTL:false
  })
  
  const translationGetters={
    'en-IN':()=>require("./src/translations/en.json"),
    'en':()=>require("./src/translations/en.json"),
    'hi':()=>require("./src/translations/hi.json")
  }
  
  const translate=memoize(
    (key,config)=>i18n.translate(key,config),
    (key,config)=>config ? key + JSON.stringify(config) : key
    )
  
    const setConfig=()=>{
      i18n.fallbacks=true;
      i18n.missingTranslation=()=>{return undefined}
      const fallbacks={languageTag:'en',isRTL:false}
      const {languageTag,isRTL}=languageValue;
      translate.cache.clear();
      I18nManager.forceRTL(isRTL);
      i18n.translations={
        [languageTag]:translationGetters[languageTag]()
      };
      i18n.locale=languageTag;
    }
  

  const [openDialog,setOpenDialog]=useState(false)
  setConfig();

  const languageList=[
    {
      label:"English"
    },
    {
      label:"Hindi"
    }
  ];

  const selectLanguageClickHandler=(event)=>{
      if(event.label==='English'){
        setLanguageValue({
          languageTag:'en',
          isRTL:false
        })
        setOpenDialog(false);
      }else if(event.label==='Hindi'){
        setLanguageValue({
          languageTag:'hi',
          isRTL:false
        })
        setOpenDialog(false)
      }
  }

  const CustomDialogBox=()=>(
    <Modal style={{flex:1}} onBackdropPress={()=>{
      setOpenDialog(false)
    }} isVisible={openDialog}>
      <View style={styles.mainContainer}>
        <View style={styles.dialogStyle}>
          <Text style={{...styles.titleStyle,textAlign:'center'}}>Choose Language</Text>
          <RadioButton
            data={languageList}
            selectedBtn={selectLanguageClickHandler}
            textStyle={styles.contentStyle}
            circleSize={16}
            animatiomTypes={['pulse']}
          />   


        </View>
      </View>
    </Modal>
  )

  const changeLangClickHandler=()=>{
    setOpenDialog(true);
  }



  return(
    <View style={styles.mainContainer}>
      <Text style={styles.titleStyle}>{translate('title')}</Text>
      <Text style={styles.contentStyle} numberOfLines={10}>{translate('content')}</Text>
      <TouchableOpacity onPress={changeLangClickHandler} activeOpacity={0.6} style={styles.btnStyle} >
        <Text style={styles.textStyle}>{translate('change_language')}</Text>
      </TouchableOpacity>
      <CustomDialogBox/>
    </View>
  )
}

const styles=StyleSheet.create({
  mainContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:15
  },
  btnStyle:{
    width:'100%',
    paddingVertical:10,
    borderRadius:30,
    backgroundColor:'blue',
  },
  textStyle:{
    fontSize:20,
    width:'100%',
    color:'white',
    textAlign:'center',
    fontWeight:'bold'
  },
  contentStyle:{
    fontSize:20,
    fontWeight:'bold',
    marginBottom:25
  },
  titleStyle:{
    fontSize:24,
    fontWeight:'bold',
    marginBottom:20,
    textDecorationLine:'underline',
  },
  dialogStyle:{
    width:'100%',
    paddingVertical:20,
    paddingHorizontal:10,
    backgroundColor:'white',
    borderRadius:30
  }
})

export default App;