import pandas as pd
import wget

# Download batch audio files from a website. 
# The naming of the files match Alexa Yallah audio format. You can upload these
# files to your S3 for Alexa Yallah skill to use.

baseUrl = "https://everyayah.com/data/AbdulSamad_64kbps_QuranExplorer.Com/"


# download audio files from everyayah.com
df = pd.read_csv("./verses2.csv")
index = 0;

while ( index < len(df)):
    fileName = str(df.loc[index][0]).zfill(3)+str(df.loc[index][1]).zfill(3)+".mp3"
    url = baseUrl + fileName
    toFile = "./audio/"+fileName
    wget.download(url, toFile)
    index+=1                
