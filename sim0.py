# Import dependencies
import pandas as pd
from pandas import Series, DataFrame
from datetime import datetime
import datetime as dt
import time
import requests
import json
import numpy as np
import sqlalchemy




import locale
locale.setlocale(locale.LC_ALL,'')



# Dependencies for sending dataframes to sql database
from sqlalchemy import create_engine
from sqlConfig import user, password

# Prepare to send dataframe to postgresSQL database. Create connection
rds_connection_string = user + ":" + password + "@localhost:5432/investmentDB"
engine = create_engine(f'postgresql://{rds_connection_string}')

summary_df = pd.read_sql_query("select * from data_summary",con=engine)
summary_df=summary_df.set_index("index")
summary_df = summary_df[['Very_Conservative','Conservative','Moderate','Aggressive','Very_Aggressive']]

mean_list = summary_df.loc['mean',['Very_Conservative','Conservative','Moderate','Aggressive','Very_Aggressive']]
mean_list = mean_list.tolist()



std_list = summary_df.loc['std',['Very_Conservative','Conservative','Moderate','Aggressive','Very_Aggressive']]
std_list = std_list.tolist()


max_list =summary_df.loc['max',['Very_Conservative','Conservative','Moderate','Aggressive','Very_Aggressive']]
max_list = max_list.tolist()

Portfolios = ['Very_Conservative','Conservative','Moderate','Aggressive','Very_Aggressive']
big_lst= []

def CalculatorCall(currentPortfolio, additionalInvestment, noOfYrs):
    # currentPortfolio = float(request.form["CurrentPortfolio"])
    # additionalInvestment = float(request.form["AdditionalInvestment"])
    # noOfYrs = int(request.form["NoOfYrs"])

    for x in range(0,5):
        pv = 1000
        time_horizon = 5
        i = mean_list[x]
        additions = 3000
        lst=[]
        for year in range(time_horizon):
            ending = pv * (1+i) + additions
            #print(locale.currency(ending, grouping=True))
            pv = ending
            lst.append(pv)

        high_value = lst[-1]   
        low_value = high_value *(1-max_list[x])
        new_lst = [Portfolios[x],high_value, low_value]
        big_lst.append(new_lst)
    data = pd.DataFrame(big_lst)
    data = data.rename(columns={0: 'Portfolios', 1: 'High Value',2:'Low Value'})

    data = data.set_index('Portfolios')
    data_json = (data).to_json(orient='table')
    return(data_json)

print(CalculatorCall(1000,100,30))