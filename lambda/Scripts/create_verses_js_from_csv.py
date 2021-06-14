import pandas as pd

# Create js object of translation and verse information from a csv file
# You can use this to update the verses.json file in Yallah Alexa Skill
# @OnderSecen - June 2021

df = pd.read_csv("./verses2.csv")
file = open("./verses.json","w")
index = 0;
file.write("module.exports = [\n")
while ( index < len(df)):
    file.write("{\n\t")
    file.write("'Meaning\': \'"+df.loc[index][2]+"\',\n\t")
    file.write("'Chapter\': \'"+str(df.loc[index][0]).zfill(3)+"\',\n\t")
    file.write("'Verse\'  : \'"+str(df.loc[index][1]).zfill(3)+"\'\n")
    file.write("}")
    if ( index < len(df)-1):
        file.write(",")
    file.write("\n")

    index+=1                
file.write("];")
file.close()