import React from 'react'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import KeyValueForm from './key-value-form'
import { RequestTab } from '../store/useRequestStore'
import { toast } from 'sonner';
import BodyEditor from './BodyEditor';

interface Props {
  tab:RequestTab;
  updateTab:(id:string, data:Partial<RequestTab>)=>void;
}




const RequestEditorArea = ({tab, updateTab}:Props) => {
  const parseKeyValueData = (jsonString?:string)=>{
  if(!jsonString) return [];

  try {
    return JSON.parse(jsonString)
  } catch{
    return [];
  }
}

const getHeadersData = ()=>{
  const parsed = parseKeyValueData(tab.headers);
  return parsed.length > 0 ? parsed : [{key:"", value:"", enabled:true}];
}

const getParamtersData = ()=>{
  const parsed = parseKeyValueData(tab.parameters)
  return parsed.length > 0 ? parsed : [{key:"", value:"", enabled:true}]; 
}

const getBodyData = ()=>{
  return {
    contentType:'application/json' as const,
    body:tab.body || ''
  }
} 

const HandleHeadersChange = (data:{key:string, value:string, enabled?:boolean}[])=>{
  const filteredHeaders = data.filter((item)=>
    item.enabled !== false && (item.key.trim() || item.value.trim())
  );
  updateTab(tab.id, {headers:JSON.stringify(filteredHeaders)});
  toast.success("Headers updated successfully")
}

const HandleParameterChange = (data:{key:string, value:string, enabled?:boolean}[])=>{
  const filteredParams = data.filter((item)=>
    item.enabled !== false && (item.key.trim() || item.value.trim())
  );
  updateTab(tab.id, {parameters:JSON.stringify(filteredParams)})
  toast.success("Parameters updated successfully")
}

const handleBodyChange = (data:{contentType:string, body?:string})=>{
  updateTab(tab.id, {body:data.body || ''});
  toast.success("Body updated successfully ")
}








  return (
    <Tabs defaultValue='parameters' className='bg-zinc-900 rounded-md w-full px-4 py-4'>
      <TabsList className='bg-zinc-700 rounded-t-md'>
        <TabsTrigger value='parameters' className='flex-1'>
          Parameters
        </TabsTrigger>
        <TabsTrigger value='headers' className='flex-1'>
          Headers
        </TabsTrigger>
        <TabsTrigger value='body' className='flex-1'>
          Body
        </TabsTrigger>
      </TabsList>

      <TabsContent value='parameters'>
        <KeyValueForm
        initialData={getParamtersData()}
        onSubmit={HandleParameterChange}
        placeHolder={{
          key:"Para name",
          value:"Para value",
          description:"Para desc",
          
        }}
        />

      </TabsContent>

      <TabsContent value='headers'>
        <KeyValueForm
        initialData={getHeadersData()}
        onSubmit={HandleHeadersChange}
        placeHolder={{
          key:"Header name",
          value:"Header value",
          description:"HTTP header",
        }}
        />

      </TabsContent>

      <TabsContent value='body'>
        <BodyEditor
        initialData={getBodyData()}
        onSubmit={handleBodyChange}
        />

      </TabsContent>
    </Tabs>
  )
}

export default RequestEditorArea