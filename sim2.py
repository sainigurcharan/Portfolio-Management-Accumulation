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


def calculateSim2(principal, annual_contribution, noOfYrs, type):
    sim = DataFrame() 
    iterations = 100

    
    select_portfolio = type
    for x in range(iterations):
        
        expected_return = summary_df.iloc[0][select_portfolio]#.0867 #Value based on selection
        volatility = summary_df.iloc[1][select_portfolio]#.17 #Value based on selection
        time_horizon = noOfYrs
        pv = principal
        annual_investment = annual_contribution
        stream = []
        
        for i in range(time_horizon):
            
            end = round(pv * (1 + np.random.normal(expected_return,volatility)) + annual_investment,2)
            
            stream.append(end)
    
            pv = end

        
        sim[x] = stream
    
    ending_values = sim.loc[time_horizon-1]
    ending_json = (ending_values).to_json(orient='table')
    return(ending_json)

      
  

print (calculateSim2(1000, 100, 5, "Moderate"))  