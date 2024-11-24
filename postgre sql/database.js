import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://gyswpkinpqyfnwqpzste.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5c3dwa2lucHF5Zm53cXB6c3RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5MDc3MzgsImV4cCI6MjA0NDQ4MzczOH0.sx-DfMckOzusV2cJOo2xqr4TYbcn3_F0vqtDrrhaELM';
const supabase = createClient(supabaseUrl,supabaseKey);

export async function addExpenseToDB(name,amount,date) {
    const {data,error} = await supabase
    .from("expenses")
    .insert([{name, amount, date}])
    .select();
    if(error) {
      console.error("Error adding expense:",error.message);
      return null;
    }
    return data.length>0 ? data[0] : null;
}

export async function getExpensesFromDB() {
  const {data: expenses,error} = await supabase
  .from("expenses")
  .select("*")
  .order('id', { ascending: true });

  if(error) {
    console.error("Error fetching expenses:", error);
    return [];
  }
  return expenses;
}

export async function deleteExpenseFromDB(id) {
  const {data, error} = await supabase
  .from("expenses")
  .delete()
  .eq("id",id);

  if(error) {
    console.error("Error deleting expense:",error);
    return null;
  }
  return data;
}

export async function updateExpenseInDB(expenseId,updatedName,updatedAmount,updatedDate) {
   try{
    const {data,error} = await supabase
    .from("expenses")
    .update({name:updatedName, amount:updatedAmount, date: updatedDate})
    .eq("id",expenseId);

    if(error) {
      console.error("Error object:"+ JSON.stringify(error,null,2));
    } else {
      console.log("Expense updated:",data);
    }
   } catch(err) {
    console.error("Error updating expense:",err);
   }
}





































