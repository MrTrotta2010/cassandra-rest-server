# importing the pandas library
import pandas as pd

# reading the csv file
df = pd.read_csv("backup.csv")

for i in range(df.shape[0]):
    #print(df['insertiondate'][i])
    datacagada = df['insertiondate'][i]
    date = str(datacagada).split(" ")
    time = str(date[1]).split("+")
    datacorreta = date[0]+'T'+time[0]+'Z'
    df['insertiondate'][i] = datacorreta

# writing into the file
df.to_csv("backupnovo.csv", index=False)

print(df)

