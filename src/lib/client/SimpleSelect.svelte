<script lang='ts'>
    export let name: string;
    export let idName: string = '';
    export let className: string = '';
    export let options: Array<string>;
    export let value: string = '';
</script>

<select name={name} bind:value={value} id={idName} class={className}> 
    {#each options as option}
        <option value={option}>{option}</option>
    {/each }
</select>