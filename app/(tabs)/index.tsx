import { ScrollView, StyleSheet,RefreshControl } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

interface File {
  name: string;
  type: string;
  size?:number;
  children: File[];
}

export default function  TabTwoScreen() {

  const [directory, setDirectory] = useState<File[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [subDir,setSubDir] = useState<File[]>([])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
     

    const fetchData = async () => {
      try {
        const response = await axios.get<{ files: File[] }>('http://192.168.0.101/listFiles');
        setDirectory(response.data.files);      
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
  
    fetchData(); 
  }, []);

useEffect(()=>{
  const fetchData = async () => {
    try {
      const response = await axios.get<{ files: File[] }>('http://192.168.0.101/listFiles');
      setDirectory(response.data.files);      
      // Log each file's name and id
      // console.log("||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||")
      // directory.map((item) => {
      //   console.log(item.name,"--", item.type,"--",item.children,"--",item.size);
      //   setSubDir(item.children)
      //   console.log("\nprinting subdirectories\n")
      //   subDir.map((subItem)=>{
      //     console.log(subItem.name,"--", subItem.type,"--",subItem.children,"--",subItem.size);
      //   })
      // });
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  fetchData();  
},[])



  return (
    <ScrollView refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    } style={styles.container}>
      {
        directory.map((item,index)=>{
          return (
            item.type==="directory"? (
            <>
              <View style={styles.directory} key={index}>
                <Text>{item.name}</Text>
              </View>
              <View style={styles.subDir}>
                {
                  item.children?(
                    item.children.map((sub,index)=>{
                      return (
                        <View style={styles.subfiles} key={index}>
                          <Text>{sub.name}</Text>
                        </View>
                      )
                    })
                  ):
                  <View>
                    <Text>No Files or folders inside </Text>
                  </View>
                }
              </View>
            </>
            ) :
            <View style={styles.files} key={index}>
              <Text>{item.name}</Text>
            </View>
          )
        })
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    padding:10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  directory:{
    minHeight:80,
    width:"100%",
    borderRadius:5,
    backgroundColor:"grey",
    marginVertical:10,
    padding:10,
    justifyContent: 'center',
   },
  files:{
    minHeight:80,
    width:"100%",
    borderRadius:5,
    backgroundColor:"blue",
    marginVertical:10,
    padding:10,
    justifyContent: 'center',
  },
  subfiles:{
    minHeight:60,
    width:"90%",
    borderRadius:5,
    backgroundColor:"green",
    marginVertical:5,
    margin:10,
    marginLeft:20,
    padding:10,
    justifyContent: 'center',
  },
  subDir:{
   marginTop:10,
  }
});
