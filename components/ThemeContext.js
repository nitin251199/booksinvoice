import React from 'react';

export const ThemeContext = React.createContext();

export const ThemeProvider = ({children}) => {
  // theme = light, dark
  const [theme, setTheme] = React.useState('dark');
  const [darkMode, setDarkMode] = React.useState(true);
  // const [show, setShow] = React.useState(false);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      setDarkMode(true);
    } else {
      setTheme('light');
      setDarkMode(false);
    }
  };

  // const currentSong = useSelector(state => state.currentSong);
  // const status = useSelector(state => state.isSubscribed);
  // const progress = useProgress();

  // useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
  //   if (event.type === Event.PlaybackTrackChanged) {
  //     const track = await TrackPlayer.getTrack();
  //     console.log('track', track);
  //   }
  // });

  // const getSectionDone = async() => {
  //   if (!status) {
  //     const currentTrack = await TrackPlayer.getCurrentTrack();
  //     if (currentTrack != null) {
  //       if (Math.floor(progress.position) >= currentSong.duration) {
  //         // await TrackPlayer.stop();
  //         // setModalVisible(true);
  //       }
  //     }
  //   }
  // }

      // useEffect(()=>{
      //   getSectionDone();
      // },[])


      

  // const [song, setSong] = React.useState(null);

  return (
    <ThemeContext.Provider value={{theme, toggleTheme, darkMode}}>
      {children}
    </ThemeContext.Provider>
  );
};